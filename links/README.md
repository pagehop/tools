# Links (:l)

> Tool to get all links (html anchors) on a page.

## Usage

After you selected a recipe, and 	got results from it, at the end of the query add a space and **:l**.

```
(recipeId string) [recipe options] [other tools] :l [offline search string]
```

As you can see, you can make an offline search by directly appending your query after :l (delimited with space).


## Examples

Here is an example with the HackerNews recipe, producing results before we use the tool:

```
hack :l
```

This should will result in all links on the page of the first post on the HackerNews.

And the same example with an offline search for a specific address:

```
hack :a price
```

## Results

Only links with text are being returned. On the second line of every result, you can see the address (taken from the href of the anchor).