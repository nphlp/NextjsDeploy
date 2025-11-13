export default function Page() {
    return (
        <div>
            <h1>SSR (take 3) + useFetch + Toggle (take 3 or 10 items)</h1>
            <p>
                -&gt; Fetch 3 server, puis foetch 10 client
                <br />
                -&gt; Hydrate useFetch initialData
                <br />
                -&gt; ⛔︎ Perd le state au refresh
            </p>
        </div>
    );
}
