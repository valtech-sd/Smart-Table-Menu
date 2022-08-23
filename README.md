# Smart-Table-Menu

Demo of enabling a user to make a selection from a menu projected onto a table using hand gestures

## Getting Started

1. Install the dependencies

```
pnpm install
```

2. Create a `.env.local` file with the following values

```txt
VITE_FLIPPED_VIDEO=false
```

3. Run the project

```
pnpm run dev
```

## Features

This webapp has two different routes you can visit (after running `pnpm run dev`):

- '/': This is the main path which shows the menu and cart on top of a black background. This was thought as the real life scenario where the demo gets projected on a dummy table with the goal of converting it into a smart table.
- '/webcam': This is the path which shows the menu and cart on top of a webcam preview. We added this route in order to develop and test the demo functionality in a easier way.

## Libraries

| Category         | Technology                                                            |
| ---------------- | --------------------------------------------------------------------- |
| Object detection | [Tensorflow](https://github.com/tensorflow/tfjs)                      |
| Model            | [Handpose](https://www.npmjs.com/package/@tensorflow-models/handpose) |
| Fingerpose       | [Fingerpose](https://github.com/andypotato/fingerpose)                |
| Cart             | [Cart](https://www.npmjs.com/package/react-use-cart)                  |
| Webcam           | [react-webcam](https://github.com/mozmorris/react-webcam)             |
