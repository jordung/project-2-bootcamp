import { useContext } from "react";
import { UserContext, WoofsContext } from "../App";
import WoofCard from "../components/WoofCard";
import { formatTime } from "../utils/utils";

function Notifications() {
  const woofs = useContext(WoofsContext);
  const { user, userinfo } = useContext(UserContext);

  const ownWoofs = woofs.filter((woof) => woof.val.user === user.uid);
  console.log(ownWoofs);
  return (
    <div className="bg-white min-h-screen flex flex-col justify-start items-start mt-20">
      <div className="flex justify-center w-screen items-center h-16">
        <div className="pt-1 pb-24 md:pb-0 max-sm:min-w-[90vw]">
          <div className="flow-root">Notifications</div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
