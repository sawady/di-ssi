<script>
	export let title;
</script>

<style>
	article {
		border: 1px #ccc solid;
		border-radius: 4px;
		position: relative;
    margin-bottom: 25px;
    word-break: break-word;
	}

	article > div {
		padding: 1.25rem;
	}

	h3 {
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.body {
		background-color: #eee;
		border-top: 1px #ccc solid;
	}
</style>

<article>
	<div>
		<h3>{title}</h3>
	</div>
	<div class="body">
		<slot></slot>
	</div>
</article>
