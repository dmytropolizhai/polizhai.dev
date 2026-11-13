import { type SchemaTypeDefinition } from "sanity";
import { clientQuoteType } from "./clientQuote";
import { customerType } from "./customer";
import { journeyEntryType } from "./journeyEntry";
import { projectType } from "./project";
import { serviceType } from "./service";
import { servicesSettingsType } from "./servicesSettings";
import { siteSettingsType } from "./siteSettings";
import { testimonialType } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettingsType,
  projectType,
  journeyEntryType,
  serviceType,
  servicesSettingsType,
  testimonialType,
  clientQuoteType,
  customerType,
];
