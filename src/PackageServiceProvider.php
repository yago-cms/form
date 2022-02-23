<?php

namespace Yago\Form;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Yago\Form\View\Components\Form;

class PackageServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Append config
        Config::set('lighthouse.namespaces.models', [
            'Yago\\Form\\Models',
            ...Config::get('lighthouse.namespaces.models'),
        ]);

        // Migrations
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations/');

        $this->publishes([
            __DIR__ . '/../resources/backend/js/' => base_path('backend/src/vendor/yago/form/js'),
        ], 'public');

        $this->loadViewsFrom(__DIR__ . '/../resources/frontend/views', 'yago-form');

        $this->loadViewComponentsAs('yago-form', [
            Form::class,
        ]);

        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $dispatcher = app(\Illuminate\Contracts\Events\Dispatcher::class);
        $dispatcher->listen(
            \Nuwave\Lighthouse\Events\BuildSchemaString::class,
            function (): string {
                return file_get_contents(__DIR__ . '/../graphql/schema.graphql');
            }
        );
    }
}
