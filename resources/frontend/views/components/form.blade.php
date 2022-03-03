<form action="{{ route('yago.form.store') }}" method="post">
    @csrf

    <input type="hidden" name="form_id" value="{{ $form->id }}" />

    @if ($errors->any())
        <div class="alert alert-danger">
            <?php echo __('yago-form::form.validation-error'); ?>
        </div>
    @endif

    @foreach ($config->fields as $field)
        @php
            $id = Str::uuid();
        @endphp

        @switch($field->type)
            @case('text')
                <div class="mb-3">
                    <label for="{{ $id }}" class="form-label">{{ $field->label }}</label>
                    <input type="text" class="form-control @error($field->name) is-invalid @enderror" name="{{ $field->name }}"
                        placeholder="{{ $field->placeholder }}" id="{{ $id }}" value="{{ old($field->name) }}">

                    @error($field->name)
                        <div class="invalid-feedback">
                            {{ Str::replace($field->name, Str::lower($field->label), $message) }}
                        </div>
                    @enderror
                </div>
            @break

            @case('dropdown')
                <div class="mb-3">
                    <label for="{{ $id }}" class="form-label">{{ $field->label }}</label>
                    <select class="form-select @error($field->name) is-invalid @enderror" name="{{ $field->name }}"
                        id="{{ $id }}">
                        @if ($field->placeholder)
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
