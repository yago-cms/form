<?php

namespace Yago\Form\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Yago\Form\Mail\FormSubmitted;
use Yago\Form\Models\Form;
use Yago\Form\Models\FormSubmission;
use Illuminate\Support\Facades\Mail;

class FormController extends Controller
{
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

        $formSubmission = new FormSubmission;
        $formSubmission->form_id = $formId;
        $formSubmission->data = json_encode($validated);
        $formSubmission->config = json_encode($config->fields);
        $formSubmission->ip = $request->ip();
        $formSubmission->save();

        if ($config->settings->sendEmail === true) {
            foreach ($config->recipents as $recipent ) {
                Mail::to($recipent->email)->send(new FormSubmitted($formSubmission));
            }
        }

        return back()
            ->with('message', $config->settings->successMessage ? $config->settings->successMessage : __('Form submitted successfully.'))
            ->with('message-type', 'info')
            ->with('message-context', 'yago-form');
    }
}
