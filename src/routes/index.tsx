import { createResource, onCleanup, Suspense } from "solid-js";
import { Title } from "solid-start";

export default function Home() {
  return (
    <main>
      <Title>Lifecycle w Suspense Debugging</Title>

      <h1>Lifecycle w Suspense Debugging</h1>

      {/* comment DataComp-1 out, reload, and see terminal logs for issue. onCleanup not called for DataCompWithInnerSuspense-1 */}
      <Suspense>
        <DataComp name="DataComp-1" />
      </Suspense>

      <DataCompWithInnerSuspense name="DataCompWithInnerSuspense-1" />
      <DataCompWithInnerSuspense name="DataCompWithInnerSuspense-2" />
      <DataCompWithInnerSuspense name="DataCompWithInnerSuspense-3" />
    </main>
  );
}

const sleep = (ms: number = 100) => new Promise((r) => setTimeout(r, ms));

const resource = (name: string, wait?: number) => {
  console.log(`call:${name}.resource`);

  onCleanup(() => {
    console.log(`onCleanup:${name}.resource`);
  });

  const r = createResource(async () => {
    await sleep(wait);

    return { name };
  });

  return r;
};

const DataComp = (props: { name: string; wait?: number }) => {
  console.log(`call:${props.name}`);

  const [data] = resource(props.name, props.wait);

  onCleanup(() => {
    console.log(`onCleanup:${props.name}`);
  });

  return <div>Name: {data()?.name}</div>;
};

const DataCompWithInnerSuspense = (props: { name: string; wait?: number }) => {
  console.log(`call:${props.name}`);

  const [data] = resource(props.name, props.wait);

  onCleanup(() => {
    console.log(`onCleanup:${props.name}`);
  });

  return (
    <Suspense>
      <div>Name: {data()?.name}</div>
    </Suspense>
  );
};
