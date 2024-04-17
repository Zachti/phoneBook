import { ConfigFactory } from "@nestjs/config"
import { ObjectSchema } from "joi"

export interface ConfigObject {
  config: ConfigFactory
  validationSchema: ObjectSchema
}
