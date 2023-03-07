import { createResource, onCleanup, onMount, Suspense } from "solid-js";
import { Title } from "solid-start";

export default function Home() {
  return (
    <main>
      <Title>Lifecycle w Suspense Debugging</Title>

      <h1>Lifecycle w Suspense Debugging</h1>

      {/* comment DataComp-1 out, reload, and see terminal logs for issue. onCleanup only called for DataCompWithInnerSuspense-2 */}
      <Suspense>
        <DataComp name="DataComp-1" wait={1000} />
      </Suspense>

      <DataCompWithInnerSuspense
        name="DataCompWithInnerSuspense-1"
        wait={1000}
      />

      <DataCompWithInnerSuspense
        name="DataCompWithInnerSuspense-2"
        wait={500}
      />
    </main>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const resource = (name: string, wait: number) => {
  console.log(`call:${name}.resource`);

  onMount(() => {
    console.log(`onMount:${name}.resource`);
  });

  onCleanup(() => {
    console.log(`onCleanup:${name}.resource`);
  });

  const r = createResource(async () => {
    await sleep(wait);

    return { name };
  });

  return r;
};

const DataComp = (props: { name: string; wait: number }) => {
  console.log(`call:${props.name}`);

  const [data] = resource(props.name, props.wait);

  onMount(() => {
    console.log(`onMount:${props.name}`);
  });

  onCleanup(() => {
    console.log(`onCleanup:${props.name}`);
  });

  return <div>Name: {data()?.name}</div>;
};

const DataCompWithInnerSuspense = (props: { name: string; wait: number }) => {
  console.log(`call:${props.name}`);

  const [data] = resource(props.name, props.wait);

  onMount(() => {
    console.log(`onMount:${props.name}`);
  });

  onCleanup(() => {
    console.log(`onCleanup:${props.name}`);
  });

  return (
    <Suspense>
      <div>Name: {data()?.name}</div>
    </Suspense>
  );
};
