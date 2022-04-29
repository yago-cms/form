<?php

namespace Yago\Form\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Yago\Form\Models\Form;
use Yago\Form\Models\FormSubmission;

class FormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    protected $formSubmission;
    protected $form;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(FormSubmission $formSubmission, Form $form)
    {
        $this->formSubmission = $formSubmission;
        $this->form = $form;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $data = json_decode($this->formSubmission->data);
        $config = json_decode($this->formSubmission->config);

        $formConfig = json_decode($this->form->config);
        $formData = [];

        $fields = [];

        foreach ($config as $field) {
            $fields[$field->name] = $field;
        }

        foreach ($data as $name => $value) {
            $field = $fields[$name];

            if ($field->type == 'dropdown') {
                $value = $field->fields[$value]->option;
            }

            $formData[] = [
                'label' => $field->label,
                'value' => $value
            ];
        }

        $view = $this->view('yago-form::emails.submitted');

        if (isset($formConfig->settings->subject)) {
            $view->subject($formConfig->settings->subject);
        }

        return $view
            ->with([
                'data' => $formData,
                'ip' => $this->formSubmission->ip,
            ]);
    }
}
