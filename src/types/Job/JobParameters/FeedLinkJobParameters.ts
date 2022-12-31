export {};
declare global {
  interface FeedLinkJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "feedLink";
    linkId: Id<StructureLink>;
  }
}
