export interface IPersonBasicInfo {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  level: string;
  maritalStatus: string;
  income: number;
  birthplace: string;
}

export interface IPersonOtherInfo {
  fatherName: string;
  fatherAge: number;
  fatherProfession: string;
  motherName: string;
  motherAge: number;
  motherProfession: string;
}

export interface IPerson extends IPersonOtherInfo, IPersonBasicInfo {}

export const personInfo: IPerson = {
  id: "1",
  name: "张三",
  age: 26,
  height: 185,
  weight: 80,
  level: "博士研究生",
  maritalStatus: "未婚",
  income: 30000,
  birthplace: "四川省成都市高新区天府四街02001号",
  fatherName: "王二",
  fatherAge: 50,
  fatherProfession: "农民",
  motherName: "刘二",
  motherAge: 48,
  motherProfession: "农民",
}