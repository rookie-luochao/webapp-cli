import { Actor } from "@reactorx/core";

interface ITalkErrField {
  field: string;
  in: string;
  msg: string;
}

type ITalkErrFields = ITalkErrField[];

export interface ITalkErr {
  talkErrId: string;
  canBeTalkError?: boolean;
  code?: number;
  desc?: string;
  errorFields?: ITalkErrFields;
  id?: string;
  key?: string;
  msg?: string;
  sources?: string[];
}

export const groupKey = "talkErr";

const talkErrActor = Actor.of(groupKey);

export const talkErrAdd = talkErrActor
  .named("add")
  .effectOn(groupKey, (talkErrState: ITalkErr[] = [], { arg }) => [...talkErrState, arg]);

export const talkErrRemove = talkErrActor.named("remove").effectOn(groupKey, (talkErrState: ITalkErr[], { arg }) => {
  const newTalkErrState = talkErrState.filter((talkErr) => talkErr.talkErrId !== arg.id);
  return newTalkErrState.length === 0 ? undefined : newTalkErrState;
});
