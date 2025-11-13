export default function Page() {
    return (
        <div>
            <h1>SSR (take 10) + useState + Toggle (show 3 or 10 items)</h1>
            <p>
                -&gt; Fecth 10 server
                <br />
                -&gt; Hydrate useState
                <br />
                -&gt; ⛔︎ Perd le state au refresh
            </p>
        </div>
    );
}
