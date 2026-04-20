# Contract: Product Context

## Product Snippet

The product-page snippet MUST expose product context through stable attributes:

```html
<button
  class="wpp-lead-product-trigger"
  data-product-name="{{ product.name }}"
  data-product-id="{{ product.id }}"
>
  Comprar pelo WhatsApp
</button>
```

## Required Attributes

- `data-product-name`: Product name shown in the qualification question and WhatsApp
  message.
- `data-product-id`: Product identifier sent with the lead payload.

## Fallback Behavior

- If either attribute is missing or empty, the widget MUST use the global subject flow.
- The widget MUST NOT read visible page text to infer product name or identifier.
- The source URL MUST come from the current browser location.
