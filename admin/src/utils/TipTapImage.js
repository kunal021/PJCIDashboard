import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "custom-image",
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => ({
          class: attributes.class,
        }),
      },
    };
  },
});
