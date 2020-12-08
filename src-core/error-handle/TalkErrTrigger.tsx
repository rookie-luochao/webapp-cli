import { useEffect } from "react";
import { useConn, useStore } from "@reactorx/core";
import { groupKey, talkErrRemove } from "src-core/error-handle/Actors";
import { useAccessMgr } from "@querycap/access";
import { message } from "antd";

export const TalkErrTrigger = () => {
  const [, , del] = useAccessMgr();
  const store$ = useStore();
  const { dispatch } = store$;
  const talkErr$ = useConn(store$, (state) => state[groupKey]);

  useEffect(() => {
    talkErr$.forEach((talkErrs) => {
      if (!talkErrs) return;
      talkErrs.forEach((talkErr: any) => {
        if (talkErr.code!.toString().includes("401")) {
          del();
          window.location.reload();
        }
        message.error(talkErr.msg);
        dispatch(talkErrRemove.with({ id: talkErr.talkErrId }));
      });
    });
  }, [talkErr$]);
  return null;
};
