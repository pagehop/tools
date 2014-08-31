# Addresses (:a)

> Converts the results in a list of addresses. This allows you to search offline for a url (or type of url), instead of searching through result titles.

## Usage

After you selected a recipe, and got results from it, at the end of the query add a space and **:a**.

```
(recipeId string) [recipe options] [other tools] :a [offline search string]
```

As you can see, you make an offline search by directly appending your query after :a (delimited with space).


## Examples

Here is an example with the HackerNews recipe, producing results before we use the tool:

```
hack :a
```

And the same example with an offline search for a specific address:

```
hack :a techcrunch.com
```

More complex example - first you search goolge for something, then you use :a to search through the results and finaly you don't use the default search (should be fuzzy), but instead use a regex tool to find the url you look for:

```
g demos infragistics grid :a :r grid.*overvi
```

## Results

The title of the items becomes their address. The original title goes in the supporting text on the second line (the displayAddress). Results initially without an address are filtered out.