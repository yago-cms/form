<?php

namespace Yago\Form\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Yago\Cms\Http\Controllers\Controller;
use Yago\Form\Mail\FormSubmitted;
use Yago\Form\Models\Form;
use Yago\Form\Models\FormSubmission;

class FormController extends Controller
{
    public function show(Request $request)
    {
        $config = $this->getConfig($request);

        $form = Form::find($config->form);
        $formConfig = json_decode($form->config);

        return view('yago-form::forms.show', compact('form', 'formConfig'));
    }

    public function store(Request $request)
    {
        $formId = $request->post('form_id');

        $form = Form::find($formId);

        $config = json_decode($form->config);

        $validation = [];

        foreach ($config->fields as $field) {
            if (isset($field->required) && $field->required === true) {
                $validation[$field->name] = 'required';
            }
        }

        $validated = $request->validate($validation);

        $formSubmission = new FormSubmission();
        $formSubmission->form_id = $formId;
        $formSubmission->data = json_encode($validated);
        $formSubmission->config = json_encode($config->fields);
        $formSubmission->ip = $request->ip();
        $formSubmission->save();

        if ($config->settings->sendEmail === true) {
            foreach ($config->recipents as $recipent) {
                Mail::to($recipent->email)->send(new FormSubmitted($formSubmission));
            }
        }

        return back()
            ->with('message', $config->settings->successMessage ? $config->settings->successMessage : __('yago-form::form.submitted'))
            ->with('message-type', 'info')
            ->with('message-context', 'yago-form');
    }
}
