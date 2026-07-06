import { isKeySegment, isArraySchemaType } from "@sanity/types";
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
function createPortableTextMemberSchemaTypes(portableTextType) {
  if (!portableTextType)
    throw new Error("Parameter 'portabletextType' missing (required)");
  return createPortableTextMemberSchemaTypesFromOf(
    portableTextType,
    portableTextType.of ?? []
  );
}
function createPortableTextMemberSchemaTypesFromOf(rootPortableTextType, of) {
  const blockType = of.find(findBlockType$1);
  if (!blockType)
    throw new Error("Block type is not defined in this schema (required)");
  const childrenField = blockType.fields?.find(
    (field) => field.name === "children"
  );
  if (!childrenField)
    throw new Error("Children field for block type found in schema (required)");
  const ofType = childrenField.type.of;
  if (!ofType)
    throw new Error(
      "Valid types for block children not found in schema (required)"
    );
  const spanType = ofType.find((memberType) => memberType.name === "span");
  if (!spanType)
    throw new Error("Span type not found in schema (required)");
  const inlineObjectTypes = ofType.filter(
    (memberType) => memberType.name !== "span"
  ) || [], blockObjectTypes = of.filter(
    (field) => field.name !== blockType.name
  ) || [];
  return {
    styles: resolveEnabledStyles$1(blockType),
    decorators: resolveEnabledDecorators$1(spanType),
    lists: resolveEnabledListItems$1(blockType),
    block: blockType,
    span: spanType,
    portableText: rootPortableTextType,
    inlineObjects: inlineObjectTypes,
    blockObjects: blockObjectTypes,
    annotations: spanType.annotations
  };
}
function resolveEnabledStyles$1(blockType) {
  const styleField = blockType.fields?.find(
    (btField) => btField.name === "style"
  );
  if (!styleField)
    throw new Error(
      "A field with name 'style' is not defined in the block type (required)."
    );
  const textStyles = styleField.type.options?.list && styleField.type.options.list?.filter(
    (style) => style.value
  );
  if (!textStyles || textStyles.length === 0)
    throw new Error(
      "The style fields need at least one style defined. I.e: {title: 'Normal', value: 'normal'}."
    );
  return textStyles;
}
function resolveEnabledDecorators$1(spanType) {
  return spanType.decorators;
}
function resolveEnabledListItems$1(blockType) {
  const listField = blockType.fields?.find(
    (btField) => btField.name === "listItem"
  );
  if (!listField)
    throw new Error(
      "A field with name 'listItem' is not defined in the block type (required)."
    );
  const listItems = listField.type.options?.list && listField.type.options.list.filter((list) => list.value);
  if (!listItems)
    throw new Error("The list field need at least to be an empty array");
  return listItems;
}
function findBlockType$1(type) {
  return type.type ? findBlockType$1(type.type) : type.name === "block" ? type : null;
}
function getSanitySubSchema(rootPortableTextType, value, path) {
  const enclosingOf = resolveEnclosingOf(rootPortableTextType, value, path);
  return createPortableTextMemberSchemaTypesFromOf(
    rootPortableTextType,
    enclosingOf ?? rootPortableTextType.of ?? []
  );
}
function resolveEnclosingOf(rootPortableTextType, value, path) {
  const parentKeyedIndex = findParentKeyedIndex(path);
  if (parentKeyedIndex < 0)
    return;
  let currentOf = rootPortableTextType.of ?? [], currentChildren = value, containerOf;
  for (let segmentIndex = 0; segmentIndex <= parentKeyedIndex; segmentIndex++) {
    const segment = path[segmentIndex];
    if (typeof segment == "string")
      continue;
    let childNode;
    if (isKeySegment(segment))
      childNode = currentChildren.find((child) => child._key === segment._key);
    else if (typeof segment == "number")
      childNode = currentChildren.at(segment);
    else
      return containerOf;
    if (!childNode)
      return containerOf;
    const member = currentOf.find((entry) => entry.name === childNode._type);
    if (!member)
      return containerOf;
    const childField = findChildArrayField(member);
    if (!childField)
      return containerOf;
    const nextOf = safeGetOf$1(childField.type) ?? [];
    isPortableTextShaped(nextOf) && (containerOf = nextOf), currentOf = nextOf;
    const rawChildren = childNode[childField.name];
    currentChildren = Array.isArray(rawChildren) ? rawChildren : [];
  }
  return containerOf;
}
function isPortableTextShaped(of) {
  return of.some((entry) => walkToRoot(entry).name === "block");
}
function walkToRoot(type) {
  return type.type ? walkToRoot(type.type) : type;
}
function findParentKeyedIndex(path) {
  let lastKeyedIndex = -1, parentKeyedIndex = -1;
  for (let index = 0; index < path.length; index++) {
    const segment = path[index];
    segment !== void 0 && isKeySegment(segment) && (parentKeyedIndex = lastKeyedIndex, lastKeyedIndex = index);
  }
  return parentKeyedIndex;
}
function findChildArrayField(member) {
  const fields = member.fields;
  if (fields) {
    for (const field of fields)
      if (isArraySchemaType(field.type))
        return { name: field.name, type: field.type };
  }
}
function safeGetOf$1(schemaType) {
  try {
    if (schemaType.jsonType === "array") {
      const arrayOf = schemaType.of;
      return Array.isArray(arrayOf) ? arrayOf : void 0;
    }
  } catch {
  }
}
function sanitySchemaToPortableTextSchema(sanitySchema) {
  const compiled = sanitySchema.hasOwnProperty("jsonType") ? sanitySchema : compileType(sanitySchema);
  return sanitySchemaTypeToSchema(compiled);
}
function sanitySchemaTypeToSchema(portableTextType) {
  if (!portableTextType)
    throw new Error("Parameter 'portableTextType' missing (required)");
  const blockType = portableTextType.of?.find(findBlockType);
  if (!blockType)
    throw new Error("Block type is not defined in this schema (required)");
  const childrenField = blockType.fields?.find(
    (field) => field.name === "children"
  );
  if (!childrenField)
    throw new Error("Children field for block type found in schema (required)");
  const ofType = childrenField.type.of;
  if (!ofType)
    throw new Error(
      "Valid types for block children not found in schema (required)"
    );
  const spanType = ofType.find((memberType) => memberType.name === "span");
  if (!spanType)
    throw new Error("Span type not found in schema (required)");
  const inlineObjectTypes = ofType.filter(
    (memberType) => memberType.name !== "span"
  ) || [], blockObjectTypes = portableTextType.of?.filter(
    (field) => field.name !== blockType.name
  ) || [], styles = resolveEnabledStyles(blockType), decorators = resolveEnabledDecorators(spanType), lists = resolveEnabledListItems(blockType), annotations = spanType.annotations, memo = /* @__PURE__ */ new Map();
  return {
    block: {
      name: blockType.name
    },
    span: {
      name: spanType.name
    },
    styles: styles.map((style) => ({
      name: style.value,
      title: style.title,
      value: style.value
    })),
    lists: lists.map((list) => ({
      name: list.value,
      title: list.title,
      value: list.value
    })),
    decorators: decorators.map((decorator) => ({
      name: decorator.value,
      title: decorator.title,
      value: decorator.value
    })),
    annotations: annotations.map((annotation) => ({
      name: annotation.name,
      title: annotation.title,
      fields: annotation.fields.map(
        (field) => sanityFieldToSchemaField(field, /* @__PURE__ */ new Set(), memo)
      )
    })),
    blockObjects: blockObjectTypes.map((blockObject) => ({
      name: blockObject.name,
      title: blockObject.title,
      fields: blockObject.fields.map(
        (field) => sanityFieldToSchemaField(field, /* @__PURE__ */ new Set([blockObject.name]), memo)
      )
    })),
    inlineObjects: inlineObjectTypes.map((inlineObject) => ({
      name: inlineObject.name,
      title: inlineObject.title,
      fields: inlineObject.fields.map(
        (field) => sanityFieldToSchemaField(field, /* @__PURE__ */ new Set([inlineObject.name]), memo)
      )
    }))
  };
}
function resolveBlockOfMember(blockType, ancestorNames, memo) {
  const styleList = blockType.fields?.find((field) => field.name === "style")?.type.options?.list, listItemList = blockType.fields?.find(
    (field) => field.name === "listItem"
  )?.type.options?.list, childrenOf = blockType.fields?.find((field) => field.name === "children")?.type.of, spanType = childrenOf?.find(
    (memberType) => memberType.name === "span"
  ), inlineObjectTypes = (Array.isArray(childrenOf) ? childrenOf : []).filter((memberType) => memberType.name !== "span"), spanDecorators = spanType?.decorators, spanAnnotations = spanType?.annotations;
  return {
    type: "block",
    styles: (Array.isArray(styleList) ? styleList : []).filter((style) => style.value).map((style) => ({
      name: style.value,
      title: style.title,
      value: style.value
    })),
    lists: (Array.isArray(listItemList) ? listItemList : []).filter((list) => list.value).map((list) => ({
      name: list.value,
      title: list.title,
      value: list.value
    })),
    decorators: (Array.isArray(spanDecorators) ? spanDecorators : []).map(
      (decorator) => ({
        name: decorator.value,
        title: decorator.title,
        value: decorator.value
      })
    ),
    annotations: (Array.isArray(spanAnnotations) ? spanAnnotations : []).map(
      (annotation) => ({
        name: annotation.name,
        title: annotation.title,
        fields: annotation.fields.map(
          (field) => sanityFieldToSchemaField(field, ancestorNames, memo)
        )
      })
    ),
    inlineObjects: inlineObjectTypes.map((inlineObject) => ({
      name: inlineObject.name,
      title: inlineObject.title,
      fields: (inlineObject.fields ?? []).map(
        (field) => sanityFieldToSchemaField(
          field,
          /* @__PURE__ */ new Set([...ancestorNames, inlineObject.name]),
          memo
        )
      )
    }))
  };
}
function safeGetOf(schemaType) {
  try {
    if (schemaType.jsonType === "array") {
      const arrayOf = schemaType.of;
      return Array.isArray(arrayOf) ? arrayOf : void 0;
    }
  } catch {
  }
}
function sanityFieldToSchemaField(field, ancestorNames, memo) {
  if (field.type.jsonType === "array") {
    const ofMembers = safeGetOf(field.type);
    return {
      name: field.name,
      type: "array",
      ...field.type.title ? { title: field.type.title } : {},
      of: ofMembers ? ofMembers.map(
        (member) => sanityOfMemberToOfDefinition(member, ancestorNames, memo)
      ) : []
    };
  }
  return {
    name: field.name,
    type: field.type.jsonType,
    ...field.type.title ? { title: field.type.title } : {}
  };
}
function sanityOfMemberToOfDefinition(memberType, ancestorNames, memo) {
  if (findBlockType(memberType))
    return resolveBlockOfMember(
      memberType,
      ancestorNames,
      memo
    );
  if (!(memberType.jsonType === "object" && "fields" in memberType && Array.isArray(memberType.fields)) || ancestorNames.has(memberType.name))
    return {
      type: memberType.name,
      ...memberType.title ? { title: memberType.title } : {}
    };
  const memoized = memo.get(memberType);
  if (memoized)
    return memoized;
  const nextAncestors = new Set(ancestorNames);
  nextAncestors.add(memberType.name);
  const definition = {
    type: "object",
    name: memberType.name,
    ...memberType.title ? { title: memberType.title } : {},
    fields: memberType.fields.map(
      (field) => sanityFieldToSchemaField(field, nextAncestors, memo)
    )
  };
  return memo.set(memberType, definition), definition;
}
function resolveEnabledStyles(blockType) {
  const styleField = blockType.fields?.find(
    (btField) => btField.name === "style"
  );
  if (!styleField)
    throw new Error(
      "A field with name 'style' is not defined in the block type (required)."
    );
  const textStyles = styleField.type.options?.list && styleField.type.options.list?.filter(
    (style) => style.value
  );
  if (!textStyles || textStyles.length === 0)
    throw new Error(
      "The style fields need at least one style defined. I.e: {title: 'Normal', value: 'normal'}."
    );
  return textStyles;
}
function resolveEnabledDecorators(spanType) {
  return spanType.decorators;
}
function resolveEnabledListItems(blockType) {
  const listField = blockType.fields?.find(
    (btField) => btField.name === "listItem"
  );
  if (!listField)
    throw new Error(
      "A field with name 'listItem' is not defined in the block type (required)."
    );
  const listItems = listField.type.options?.list && listField.type.options.list.filter((list) => list.value);
  if (!listItems)
    throw new Error("The list field need at least to be an empty array");
  return listItems;
}
function findBlockType(type) {
  return type.type ? findBlockType(type.type) : type.name === "block" ? type : null;
}
function compileType(rawType) {
  return Schema.compile({
    name: "blockTypeSchema",
    types: [rawType, ...builtinTypes]
  }).get(rawType.name);
}
export {
  createPortableTextMemberSchemaTypes,
  getSanitySubSchema,
  sanitySchemaToPortableTextSchema
};
//# sourceMappingURL=index.js.map
