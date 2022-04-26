<?php

use Yago\Form\Http\Controllers\FormController;

Route::middleware(['web'])->group(function () {
    Route::prefix('yago')
        ->name('yago.')
        ->group(function () {
            Route::prefix('form')
                ->name('form.')
                ->group(function () {
                    Route::post('', [FormController::class, 'store'])->name('store');
                    Route::get('show', [FormController::class, 'show'])->name('show');
                });
        });
});