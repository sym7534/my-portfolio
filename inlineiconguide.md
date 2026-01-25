# Inline Icon Guide (Copy-Paste)

This guide shows how to render small inline logos (UWaterloo/Polymarket/Shopify) next to text in this repo.

## 1) Import the icon PNG

```jsx
import UWaterlooLogo from "@/app/components/icon/UWaterloo.png";
```

## 2) Render inline with text

```jsx
<span className="inline-flex items-baseline gap-1 ml-2">
  <Image
    src={UWaterlooLogo}
    alt="UWaterloo Logo"
    width={14}
    height={14}
    className="object-contain relative top-[2px]"
  />
  <Link href="https://uwaterloo.ca" className="font-medium">
    UWaterloo
  </Link>
</span>
```

## 3) Requirements and notes

- Uses `next/image`, so ensure `import Image from "next/image";` is present.
- Icons live in `v2/src/app/components/icon/`.
- `inline-flex items-baseline` aligns the icon with the text.
- `relative top-[2px]` nudges the icon down for a better baseline match.
- Typical size is `width={14}` / `height={14}`.

## 4) Full minimal example

```jsx
import Image from "next/image";
import Link from "./components/Link";
import UWaterlooLogo from "@/app/components/icon/UWaterloo.png";

export default function InlineIconExample() {
  return (
    <p className="text-stone-600 dark:text-stone-400">
      CS
      <span className="inline-flex items-baseline gap-1 ml-2">
        <Image
          src={UWaterlooLogo}
          alt="UWaterloo Logo"
          width={14}
          height={14}
          className="object-contain relative top-[2px]"
        />
        <Link href="https://uwaterloo.ca" className="font-medium">
          UWaterloo
        </Link>
      </span>
    </p>
  );
}
```

