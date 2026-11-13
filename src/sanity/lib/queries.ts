import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  ...,
  portrait { ..., asset-> },
  ogImage { ..., asset-> }
}`);

export const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(order asc){
  ...,
  screenshot { ..., asset-> }
}`);

export const JOURNEY_QUERY = defineQuery(`*[_type == "journeyEntry"] | order(order asc)`);

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(order asc)`);

export const SERVICES_SETTINGS_QUERY = defineQuery(`*[_type == "servicesSettings" && _id == "servicesSettings"][0]`);

export const CLIENT_QUOTE_QUERY = defineQuery(`*[_type == "clientQuote" && _id == "clientQuote"][0]`);

export const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial"] | order(order asc){
  ...,
  photo { ..., asset-> }
}`);

export const CUSTOMERS_QUERY = defineQuery(`*[_type == "customer"] | order(order asc){
  ...,
  logo { ..., asset-> }
}`);
