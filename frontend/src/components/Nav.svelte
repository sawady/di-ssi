<script>
	import { user } from "../stores/user";

	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a></li>
		{#if $user}
			<li><a aria-current="{segment === 'credentials' ? 'page' : undefined}" href="credentials">credenciales</a></li>			
			<li><a aria-current="{segment === 'sign' ? 'page' : undefined}" href="sign">firmar</a></li>
			<li><a aria-current="{segment === 'messages' ? 'page' : undefined}" href="messages">mensajes</a></li>
			<li><a aria-current="{segment === 'logout' ? 'page' : undefined}" href="logout">salir</a></li>
		{/if}
	</ul>
</nav>
