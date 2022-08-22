<form action="{{ route('yago.form.store', [], false) }}#form-{{ $form->id }}" method="post" id="form-{{ $form->id }}">
    @csrf

    <input type="hidden" name="form_id" value="{{ $form->id }}" />

    <x-yago-cms::core.flash-message context="yago-form" />

    @if ($errors->any())
        <div class="alert alert-danger">
            <?php echo __('yago-form::form.validation-error'); ?>
        </div>
    @endif

    @foreach ($formConfig->fields as $field)
        @php
            $id = Str::uuid();

            $label = $field->label;

            if ($field->required === true) {
                $label .= '*';
            }
        @endphp

        @switch($field->type)
            @case('text')
                <div class="mb-3">
                    <label for="{{ $id }}" class="form-label">{{ $label }}</label>
                    <input type="text" class="form-control @error($field->name) is-invalid @enderror" name="{{ $field->name }}"
                        @if (isset($field->placeholder)) placeholder="{{ $field->placeholder }}" @endif id="{{ $id }}" value="{{ old($field->name) }}">

                    @error($field->name)
                        <div class="invalid-feedback">
                            {{ Str::replace($field->name, Str::lower($field->label), $message) }}
                        </div>
                    @enderror
                </div>
            @break

            @case('textarea')
                <div class="mb-3">
                    <label for="{{ $id }}" class="form-label">{{ $label }}</label>
                    <textarea class="form-control @error($field->name) is-invalid @enderror" name="{{ $field->name }}"
                        @if (isset($field->placeholder)) placeholder="{{ $field->placeholder }}" @endif
                        id="{{ $id }}">{{ old($field->name) }}</textarea>

                    @error($field->name)
                        <div class="invalid-feedback">
                            {{ Str::replace($field->name, Str::lower($field->label), $message) }}
                        </div>
                    @enderror
                </div>
            @break

            @case('checkbox')
                <div class="mb-3">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input @error($field->name) is-invalid @enderror"
                            name="{{ $field->name }}" id="{{ $id }}">
                        <label for="{{ $id }}" class="form-check-label">{{ $label }}</label>

                        @error($field->name)
                            <div class="invalid-feedback">
                                {{ Str::replace($field->name, Str::lower($field->label), $message) }}
                            </div>
                        @enderror
                    </div>
                </div>
            @break

            @case('dropdown')
                <div class="mb-3">
                    <label for="{{ $id }}" class="form-label">{{ $label }}</label>
                    <select class="form-select @error($field->name) is-invalid @enderror" name="{{ $field->name }}"
                        id="{{ $id }}">
                        @if (isset($field->placeholder))
                            <option value="">{{ $field->placeholder }}</option>
                        @endif
                        @foreach ($field->fields as $value => $label)
                            <option value="{{ $value }}">{{ $label->option }}</option>
                        @endforeach
                    </select>

                    @error($field->name)
                        <div class="invalid-feedback">
                            {{ Str::replace($field->name, Str::lower($field->label), $message) }}
                        </div>
                    @enderror
                </div>
            @break

            @default
        @endswitch
    @endforeach

    <button class="btn btn-primary">{{ __('yago-form::form.submit') }}</button>
</form>