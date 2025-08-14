```markdown
# React Conditional Component

A React component designed to simplify conditional rendering and list iteration, providing a more readable and maintainable alternative to ternary operators and verbose conditional logic.

## Installation

```bash
npm install react-ternary-be-gone
# or
yarn add react-ternary-be-gone
```



## Usage

```javascript
import Conditional, { Case, If, ElseIf, Else } from 'react-ternary-be-gone';

// Basic conditional rendering
<Conditional when={true}>
  <p>This will be rendered.</p>
</Conditional>

<Conditional when={55>33}>
  <p>55 is bigger than 33</p>
</Conditional>

<Conditional when={false} fallback={<p>This is the fallback.</p>}>
  <p>This will not be rendered.</p>
</Conditional>

// Iterating over a list
const items = ['Item 1', 'Item 2', 'Item 3'];

<Conditional each={items}>
  {(item, index) => <p key={index}>{item}</p>}
</Conditional>

// Switch-case rendering
const value = 'b';

<Conditional switch={value}>
  <Case when="a">A selected</Case>
  <Case when="b">B selected</Case>
  <Case default>None selected</Case>
</Conditional>

// If-ElseIf-Else rendering
const status = 'loading';

<Conditional>
  <If when={status === 'loading'}>
  <p>Loading...</p>
  </If>
  <ElseIf when={status === 'success'}>
  <p>Success!</p>
  </ElseIf>
  <Else>
  <p>Status unknown.</p>
  </Else>
</Conditional>

// If-ElseIf-Else with advanced props
const users = [{ id: 1, name: 'Alice', active: true }, { id: 2, name: 'Bob', active: false }];

<Conditional>
  <If when={users.length > 0} each={users} filter={user => user.active}>
    {(user) => <p>{user.name}</p>}
  </If>
  <Else>
  <p>No users found.</p>
  </Else>
</Conditional>
```
### If-ElseIf-Else Blocks

You can use `<If>`, `<ElseIf>`, and `<Else>` as children of `<Conditional>` (without any prop on Conditional itself) to mimic if-else if-else logic. The first matching block is rendered. You can use all Conditional props (each, filter, sort, etc.) on these blocks.

**Example:**

```javascript
import Conditional, { If, ElseIf, Else } from 'react-ternary-be-gone';

const status = 'success';

<Conditional>
  <If when={status === 'loading'}>
    <p>Yükleniyor...</p>
  </If>
  <ElseIf when={status === 'success'}>
    <p>Başarılı!</p>
  </ElseIf>
  <Else>
    <p>Durum bilinmiyor.</p>
  </Else>
</Conditional>
```

**Advanced Example (with array props):**

```javascript
const users = [{ id: 1, name: 'Alice', active: true }, { id: 2, name: 'Bob', active: false }];

<Conditional>
  <If when={users.length > 0} each={users} filter={user => user.active}>
    {(user) => <p>{user.name}</p>}
  </If>
  <Else>
    <p>Kullanıcı yok.</p>
  </Else>
</Conditional>
```

You can use multiple `<ElseIf>` blocks. The first matching block is rendered. All Conditional props (each, filter, sort, etc.) are supported on If/ElseIf/Else blocks.
### `switch` (Switch-Case Rendering)

Allows you to use switch-case style rendering with `<Case>` children. The `switch` prop sets the value to match, and each `<Case when={...}>...</Case>` child is checked. If no match is found, `<Case default>...</Case>` is rendered if present.

**Type:** `any`

**Example:**

```javascript
import Conditional, { Case } from 'react-ternary-be-gone';

const value = 'b';

<Conditional switch={value}>
  <Case when="a">A seçildi</Case>
  <Case when="b">B seçildi</Case>
  <Case default>Hiçbiri seçilmedi</Case>
</Conditional>
```

#### `<Case>`

Child component for use with `switch` prop. Use `when` for matching value, and `default` for the default case.

**Props:**

- `when`: Value to match against the `switch` prop.
- `default`: Boolean, renders if no other case matches.

**Example:**

```javascript
<Conditional switch={status}>
  <Case when="loading">Loading...</Case>
  <Case when="success">Success!</Case>
  <Case default>Status unknown.</Case>
</Conditional>
```

## Props

### `when`

A boolean value that determines whether the children should be rendered.

**Type:** `boolean`

**Example:**

```javascript
<Conditional when={isLoggedIn}>
  <p>Welcome, user!</p>
</Conditional>
```

### `each`

An array to iterate over and render children for each item.

**Type:** `array`

**Example:**

```javascript
const data = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

<Conditional each={data}>
  {(item, index) => <p key={item.id}>{item.name}</p>}
</Conditional>
```

### `children`

The content to be rendered based on the `when` condition or for each item in the `each` array. Can be a React node or a render prop function.

**Type:** `ReactNode | (item: any, index: number, array: any[]) => ReactNode`

**Example (ReactNode):**

```javascript
<Conditional when={true}>
  <p>This is a simple paragraph.</p>
</Conditional>
```

**Example (Render Prop):**

```javascript
const items = ['A', 'B', 'C'];

<Conditional each={items}>
  {(item, index) => <p key={index}>Item {index + 1}: {item}</p>}
</Conditional>
```

### `fallback`

The content to be rendered if the `when` condition is false or the `each` array is empty.

**Type:** `ReactNode`

**Example:**

```javascript
<Conditional when={false} fallback={<p>Not logged in.</p>}>
  <p>Welcome!</p>
</Conditional>
```

### `empty`

The content to be rendered if the `each` array is empty. Overrides `fallback` when iterating.

**Type:** `ReactNode`

**Example:**

```javascript
const emptyList = [];

<Conditional each={emptyList} empty={<p>No items found.</p>}>
  {(item) => <p>{item}</p>}
</Conditional>
```

### `loading`

A boolean value indicating whether the component is in a loading state. If true, the `fallback` prop (or a default loading message) will be rendered.

**Type:** `boolean`

**Example:**

```javascript
<Conditional loading={isLoading} fallback={<p>Loading data...</p>}>
  <p>Data loaded!</p>
</Conditional>
```

### `error`

An error message to be displayed if an error occurs.

**Type:** `string`

**Example:**

```javascript
<Conditional error={errorMessage}>
  <p>Content.</p>
</Conditional>
```

### `keyExtractor`

A function to extract a unique key for each item when iterating over the `each` array.

**Type:** `(item: any, index: number) => string | number`

**Default:** `(item, index) => index`

**Example:**

```javascript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

<Conditional each={users} keyExtractor={(user) => user.id}>
  {(user) => <p key={user.id}>{user.name}</p>}
</Conditional>
```

### `filter`

A function to filter the `each` array before rendering.

**Type:** `(item: any) => boolean`

**Example:**

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

<Conditional each={numbers} filter={(num) => num % 2 === 0}>
  {(num) => <p>{num}</p>} {/* Renders 2, 4, 6 */}
</Conditional>
```

### `sort`

A function to sort the `each` array before rendering.

**Type:** `(a: any, b: any) => number`

**Example:**

```javascript
const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

<Conditional each={items} sort={(a, b) => a.name.localeCompare(b.name)}>
  {(item) => <p>{item.name}</p>} {/* Renders Alice, Bob, Charlie */}
</Conditional>
```

### `limit`

A number to limit the number of items rendered from the `each` array.

**Type:** `number`

**Example:**

```javascript
const items = ['A', 'B', 'C', 'D', 'E'];

<Conditional each={items} limit={3}>
  {(item) => <p>{item}</p>} {/* Renders A, B, C */}
</Conditional>
```

### `reverse`

A boolean value indicating whether to reverse the order of the `each` array before rendering.

**Type:** `boolean`

**Example:**

```javascript
const items = ['A', 'B', 'C'];

<Conditional each={items} reverse>
  {(item) => <p>{item}</p>} {/* Renders C, B, A */}
</Conditional>
```

### `animate`

A boolean value indicating whether to add a CSS class for animation purposes.  You'll need to define the `.conditional-animated` CSS class in your project.

**Type:** `boolean`

**Example:**

```javascript
<Conditional each={items} animate>
  {(item) => <p>{item}</p>}
</Conditional>

/* CSS (Example) */
.conditional-animated {
  /* Your animation styles here */
  transition: all 0.3s ease-in-out;
}
```

### `wrapper`

A React component or element to wrap the rendered children.  Defaults to `React.Fragment`.

**Type:** `React.ComponentType`

**Example:**

```javascript
<Conditional each={items} wrapper="ul">
  {(item) => <li key={item}>{item}</li>}
</Conditional>

// Or with a custom component:
const MyWrapper = ({ children }) => <div className="my-wrapper">{children}</div>;

<Conditional each={items} wrapper={MyWrapper}>
  {(item) => <p>{item}</p>}
</Conditional>
```

### `debug`

A boolean value that, when true, logs debugging information to the console, including the original and processed arrays.

**Type:** `boolean`

**Example:**

```javascript
<Conditional each={items} debug>
  {(item) => <p>{item}</p>}
</Conditional>
```

### `onRender`

A callback function that is called after the component renders. Provides information about the condition, item count, and whether the component is rendering conditionally or iterating.

**Type:** `(data: { condition: boolean, itemCount: number, hasCondition: boolean, hasIteration: boolean }) => void`

**Example:**

```javascript
<Conditional
  each={items}
  onRender={({ itemCount }) => console.log(`Rendered ${itemCount} items`)}
>
  {(item) => <p>{item}</p>}
</Conditional>
```

### Advanced Condition Evaluation Props

These props allow for more complex conditional checks without needing to define a separate `when` prop.  Only one of these props should be used at a time.

#### `gt` (Greater Than)

Renders children if `value` is greater than `target`.

**Type:** `{ value: number, target: number }`

**Example:**

```javascript
<Conditional gt={{ value: 10, target: 5 }}>
  <p>10 is greater than 5</p>
</Conditional>
```

#### `lt` (Less Than)

Renders children if `value` is less than `target`.

**Type:** `{ value: number, target: number }`

**Example:**

```javascript
<Conditional lt={{ value: 3, target: 7 }}>
  <p>3 is less than 7</p>
</Conditional>
```

#### `eq` (Equal)

Renders children if `value` is equal to `target`.

**Type:** `{ value: any, target: any }`

**Example:**

```javascript
<Conditional eq={{ value: 'hello', target: 'hello' }}>
  <p>The strings are equal</p>
</Conditional>
```

#### `ne` (Not Equal)

Renders children if `value` is not equal to `target`.

**Type:** `{ value: any, target: any }`

**Example:**

```javascript
<Conditional ne={{ value: 1, target: 2 }}>
  <p>1 is not equal to 2</p>
</Conditional>
```

#### `includes`

Renders children if `value` (converted to a string) includes `target`.

**Type:** `{ value: string, target: string }`

**Example:**

```javascript
<Conditional includes={{ value: 'hello world', target: 'world' }}>
  <p>The string includes "world"</p>
</Conditional>
```

#### `startsWith`

Renders children if `value` (converted to a string) starts with `target`.

**Type:** `{ value: string, target: string }`

**Example:**

```javascript
<Conditional startsWith={{ value: 'hello world', target: 'hello' }}>
  <p>The string starts with "hello"</p>
</Conditional>
```

#### `endsWith`

Renders children if `value` (converted to a string) ends with `target`.

**Type:** `{ value: string, target: string }`

**Example:**

```javascript
<Conditional endsWith={{ value: 'hello world', target: 'world' }}>
  <p>The string ends with "world"</p>
</Conditional>
```

#### `match`

Renders children if `value` (converted to a string) matches the provided regular expression `pattern`.

**Type:** `{ value: string, pattern: string }`

**Example:**

```javascript
<Conditional match={{ value: 'hello 123', pattern: '\\d+' }}>
  <p>The string contains a number</p>
</Conditional>
```

---

## `useConditionalHelpers` Hook

A hook providing helper functions to simplify common conditional logic and array manipulation tasks.

### Usage

```javascript
import { useConditionalHelpers } from 'react-ternary-be-gone';

const MyComponent = () => {
  const { isEmpty, isNotEmpty, hasLength, isEven, isOdd, sortBy, filterBy, unique } = useConditionalHelpers();
  const myArray = [1, 2, 3];

  return (
    <>
      <Conditional {...isEmpty(myArray)}>
        <p>Array is empty</p>
      </Conditional>
      <Conditional {...isNotEmpty(myArray)}>
        <p>Array is not empty</p>
      </Conditional>
    </>
  );
};
```

### Helper Functions

#### `isEmpty(array)`

Checks if an array is empty or null/undefined.  Returns an object suitable for the `when` prop.

**Parameters:**

*   `array`: The array to check.

**Returns:** `{ when: boolean }`

**Example:**

```javascript
const { isEmpty } = useConditionalHelpers();
const emptyArray = [];

<Conditional {...isEmpty(emptyArray)}>
  <p>This array is empty.</p>
</Conditional>
```

#### `isNotEmpty(array)`

Checks if an array is not empty. Returns an object suitable for the `when` prop.

**Parameters:**

*   `array`: The array to check.

**Returns:** `{ when: boolean }`

**Example:**

```javascript
const { isNotEmpty } = useConditionalHelpers();
const myArray = [1, 2, 3];

<Conditional {...isNotEmpty(myArray)}>
  <p>This array is not empty.</p>
</Conditional>
```

#### `hasLength(array, length)`

Checks if an array has a specific length. Returns an object suitable for the `when` prop.

**Parameters:**

*   `array`: The array to check.
*   `length`: The expected length.

**Returns:** `{ when: boolean }`

**Example:**

```javascript
const { hasLength } = useConditionalHelpers();
const myArray = [1, 2, 3];

<Conditional {...hasLength(myArray, 3)}>
  <p>This array has a length of 3.</p>
</Conditional>
```

#### `isEven(num)`

Checks if a number is even. Returns an object suitable for the `when` prop.

**Parameters:**

*   `num`: The number to check.

**Returns:** `{ when: boolean }`

**Example:**

```javascript
const { isEven } = useConditionalHelpers();

<Conditional {...isEven(4)}>
  <p>4 is an even number.</p>
</Conditional>
```

#### `isOdd(num)`

Checks if a number is odd. Returns an object suitable for the `when` prop.

**Parameters:**

*   `num`: The number to check.

**Returns:** `{ when: boolean }`

**Example:**

```javascript
const { isOdd } = useConditionalHelpers();

<Conditional {...isOdd(5)}>
  <p>5 is an odd number.</p>
</Conditional>
```

#### `sortBy(field, order = 'asc')`

Returns a sort function to sort an array of objects by a specific field.  Suitable for the `sort` prop.

**Parameters:**

*   `field`: The field to sort by.
*   `order`:  The sort order ('asc' or 'desc'). Defaults to 'asc'.

**Returns:** `(a: any, b: any) => number`

**Example:**

```javascript
const { sortBy } = useConditionalHelpers();
const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

<Conditional each={items} sort={sortBy('name')}>
  {(item) => <p>{item.name}</p>} {/* Renders Alice, Bob, Charlie */}
</Conditional>

<Conditional each={items} sort={sortBy('name', 'desc')}>
  {(item) => <p>{item.name}</p>} {/* Renders Charlie, Bob, Alice */}
</Conditional>
```

#### `filterBy(field, value)`

Returns a filter function to filter an array of objects by a specific field and value. Suitable for the `filter` prop.

**Parameters:**

*   `field`: The field to filter by.
*   `value`: The value to filter for.

**Returns:** `(item: any) => boolean`

**Example:**

```javascript
const { filterBy } = useConditionalHelpers();
const users = [{ id: 1, name: 'Alice', active: true }, { id: 2, name: 'Bob', active: false }];

<Conditional each={users} filter={filterBy('active', true)}>
  {(user) => <p>{user.name}</p>} {/* Renders Alice */}
</Conditional>
```

#### `unique(array, key)`

Returns a new array with only unique items, based on a key or a key extractor function.

**Parameters:**

*   `array`: The array to process.
*   `key`: The key to use for uniqueness (string) or a function that extracts the key (function).

**Returns:** `any[]`

**Example:**

```javascript
const { unique } = useConditionalHelpers();
const items = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Charlie' }];

const uniqueItems = unique(items, 'id'); // Removes the duplicate ID 1
// uniqueItems will be: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

const items2 = [{name: "Apple", color: "red"}, {name: "Banana", color: "yellow"}, {name: "Cherry", color: "red"}];
const uniqueItems2 = unique(items2, (item) => item.color);
// uniqueItems2 will be: [{name: "Apple", color: "red"}, {name: "Banana", color: "yellow"}]
```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

MIT
