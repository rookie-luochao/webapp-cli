import {IPersonBasicInfo, IPersonOtherInfo} from "./mock";

export function displayPersonBasicInfo(field: keyof IPersonBasicInfo) {
  return (
    ({
      id: "",
      name: "姓名",
      age: "年龄",
      height: "身高（cm）",
      weight: "体重（kg）",
      level: "学历",
      maritalStatus: "婚姻状况",
      income: "收入（元）",
      birthplace: "出生地址",
      socialStaffNum: "参保人数",
      historyNames: "曾用名",
      englishName: "英文名称",
    } as { [key: string]: string })[field]
  );
}

export function displayPersonOtherInfo(field: keyof IPersonOtherInfo) {
  return (
    ({
      fatherName: "父亲姓名",
      fatherAge: "父亲年龄",
      fatherProfession: "父亲职业",
      motherName: "母亲姓名",
      motherAge: "母亲年龄",
      motherProfession: "母亲职业",
    } as { [key: string]: string })[field]
  );
}

export function displayPersonInfo(field: keyof IPersonBasicInfo | keyof IPersonOtherInfo) {
  return displayPersonBasicInfo(field as keyof IPersonBasicInfo) || displayPersonOtherInfo(field as keyof IPersonOtherInfo)
}
