<?php

namespace Yago\Form\Services;

use App\Services\AbstractDataProviderService;
use Yago\Form\Models\Form;

class DataProviderService extends AbstractDataProviderService
{
    public function form(array $pageBlock)
    {
        $config = json_decode($pageBlock['content']);

        $form = Form::find($config->form);

        return $form;
    }
}
