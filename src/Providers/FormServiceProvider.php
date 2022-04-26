<?php

namespace Yago\Form\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Yago\Cms\Services\ModuleService;
use Yago\Form\Http\Controllers\FormController;

class FormServiceProvider extends ServiceProvider
{
    public function register()
    {
        // GraphQL
        $dispatcher = app(\Illuminate\Contracts\Events\Dispatcher::class);
        $dispatcher->listen(
            \Nuwave\Lighthouse\Events\BuildSchemaString::class,
            function (): string {
                return file_get_contents(__DIR__ . '/../../graphql/schema.graphql');
            }
        );

        Config::set('lighthouse.namespaces.models', [
            'Yago\\Form\\Models',
            ...Config::get('lighthouse.namespaces.models'),
        ]);
    }

    public function boot(ModuleService $moduleService)
    {
        $moduleService->register('form');

        $moduleService->registerBlock('form', 'form-form', [FormController::class, 'show']);

        $this->loadRoutesFrom(__DIR__ . '/../../routes/web.php');
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations/');
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'yago-form');
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'yago-form');

        $this->publishes([
            __DIR__ . '/../../resources/dist' => public_path('vendor/form'),
        ], 'yago-form');
    }
}