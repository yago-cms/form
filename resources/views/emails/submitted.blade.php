<p>
    @foreach ($data as $item)
        {{ $item['label'] }}: {{ $item['value'] }}<br />
    @endforeach
</p>

{{ __('yago-form::form.submitted_by_ip') }}: {{ $ip }}
