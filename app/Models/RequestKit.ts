export default interface IRequestKit {
  senderUuid: string;
  receiverUuid: string;
  availableUntil: string;
  isAvailable: boolean;
  duration: number;
  inCallWith?: string;
  inCallVia?: string;
}
