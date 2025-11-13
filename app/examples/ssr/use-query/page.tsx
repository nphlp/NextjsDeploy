export default function Page() {
    return (
        <div>
            <h1>SearchParams SSR (take 3 or 10) + useFetch + useQuery (take 3 or 10 items)</h1>
            <p>
                -&gt; Parse SearchParams côté server
                <br />
                -&gt; Fetch 3 ou 10 server, puis fetch 3 ou 10 client
                <br />
                -&gt; Hydrate useFetch initialData
                <br />
                -&gt; ✔︎ Garde le state au refresh
            </p>
        </div>
    );
}
