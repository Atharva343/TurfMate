import React, { useState } from "react";
import Navbar from "./Navbar";
import Map from "./Map";
import Sidebar from "./Sidebar";

function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    console.log("Toggling drawer, new state:", !drawerOpen);
    setDrawerOpen((prev) => !prev);
  };

  const closeDrawer = () => {
    if (drawerOpen) {
      console.log("Closing drawer");
      setDrawerOpen(false);
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={toggleDrawer}
      />
      <div className="drawer-content flex flex-col">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar onToggleDrawer={toggleDrawer} />
        </div>
        <div className="flex-1 pt-16">
          <Map />
        </div>
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>
        <div
          className={`menu p-4 w-80 bg-base-200 text-base-content min-h-full ${
            drawerOpen ? "" : "hidden"
          }`}
        >
          <Sidebar onClose={closeDrawer} />
        </div>
      </div>
    </div>
  );
}

export default Home;
