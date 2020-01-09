module.exports = function ImageBlock({ url, title }) {
  return {
    type: "image",
    title: {
      type: "plain_text",
      text: title,
      emoji: true
    },
    image_url: url,
    alt_text: title
  }
};
