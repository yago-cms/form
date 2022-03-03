<?php

namespace Yago\Form\View\Components;

use Illuminate\View\Component;

class Form extends Component
{
    public $block;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($block)
    {
        $this->block = $block;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $content = json_decode($this->block['content']);

        if (!$content) {
            return;
        }

        $form = $this->block['data'];
        $config = json_decode($form->config);

        return view('yago-form::components.form', compact('content', 'form', 'config'));
    }
}
