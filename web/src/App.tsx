import Inventory from "./components/Inventory";
import { useAppSelector } from "./hooks";
// import store from "./stores";
// import { setJoinWorld } from "./stores/WorldStore";

function App() {
  const isWorldJoined = useAppSelector((state) => state.world.isJoined);
  // useEffect(() => {
  //   store.dispatch(setJoinWorld(true));
  // }, []);
  //
  document.body.style.overflow = "hidden";

  let ui: JSX.Element;
  if (isWorldJoined) {
    ui = (
      <>
        <Inventory />
      </>
    );
  } else {
    ui = <div></div>;
  }

  return (
    <>
      <div>{ui}</div>
    </>
  );
}

export default App;
