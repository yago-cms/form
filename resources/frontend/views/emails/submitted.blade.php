<p>
    @foreach ($data as $item)
        {{ $item['label'] }}: {{ $item['value'] }}<br />
    @endforeach
</p>

Submitted by IP: {{ $ip }}
