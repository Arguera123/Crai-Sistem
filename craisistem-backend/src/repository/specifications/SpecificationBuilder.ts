import { SelectQueryBuilder } from "typeorm";

export type Specification<T> = (query: SelectQueryBuilder<T>) => void;

export class SpecificationBuilder<T> {
  private specs: Specification<T>[] = [];

  add(spec: Specification<T> | undefined) {
    if (spec) this.specs.push(spec);
    return this;
  }

  build(query: SelectQueryBuilder<T>) {
    this.specs.forEach(spec => spec(query)); 
    return query;
  }
}
