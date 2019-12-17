import { objectType } from 'nexus'

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.model.name()
  },
})
