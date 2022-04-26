<?php

namespace Yago\Form\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Yago\Form\Models\FormSubmission;

class FormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    protected $formSubmission;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(FormSubmission $formSubmission)
    {
        $this->formSubmission = $formSubmission;
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

        // dd($data, $config);
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

        return $this->view('yago-form::emails.submitted')
            ->with([
                'data' => $formData,
                'ip' => $this->formSubmission->ip,
            ]);
    }
}