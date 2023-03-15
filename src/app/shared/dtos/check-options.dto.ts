
export type CheckEvent = 'onDesign' | 'onCheck' | 'onPublish';

export class CheckOptionsDto {
  checkOnDesign: boolean;
  openDebug: CheckEvent[];
}
