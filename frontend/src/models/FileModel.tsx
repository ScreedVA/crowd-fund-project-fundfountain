export enum ContentDispositionFilter {
  ATTACHMENT = "attachment",
  INLINE = "inline",
}

export interface ContentDispositionFilterModel {
  content_disposition: ContentDispositionFilter;
}
