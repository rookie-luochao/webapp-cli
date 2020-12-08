import { RequestActor } from "@reactorx/request";
import { Observable } from "rxjs";
import { filter as rxFilter, map as rxMap } from "rxjs/operators";
import { talkErrAdd } from "./Actors";
import { v4 as uuid } from "uuid";

const errorResponseHasTalkError = () => (actor: RequestActor) => {
  return RequestActor.isFailedRequestActor(actor) && actor.arg.data.canBeTalkError;
};

export const createTalkErrHandleEpic = () => (actor$: Observable<any>) => {
  return actor$.pipe(
    rxFilter(errorResponseHasTalkError()),
    rxMap((actor) => talkErrAdd.with({ talkErrId: uuid(), ...actor.arg.data })),
  );
};