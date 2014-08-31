# Fuzzy (:f)

> Tool for fuzzy matching on the current results.

## Usage

After you selected a recipe, and got results from it, at the end of the query add a space and **:f**.

```
(recipeId string) [recipe options] [other tools] :f [search string]
```

As you have probably already guessed, Fuzzy makes an offline fuzzy matching on what's already found by recipe (and other tools).


## Examples

Recipes that don't accept query to execute, use the Fuzzy tool internally without the need to write its keyword :f. HackerNews for example doesn't accept a query and the query after the recipe-id string is used as an argument for a Fuzzy search.

```
hack javascript
```

is the same as

```
hack :f javascript
```

Also, tools that don't accept arguments - their argument is used as an argument for a Fuzzy search. In this example the Addresses tool is followed by a search string, which is internally passed to the Fuzzy tool without the need to specify it's keyword:

```
hack :a techcrunch.com
```

is the same as

```
hack :a :f techcrunch.com
```

For recipes that accept a query, you, of course, specify the keyword beforehand:

```
g demos infragistics :f grid
```

For such tools, as well:

```
g demos infragistics :r .* :f grid
```

## Results

The title of the results contain bolded portions, to highlight the matches. Otherwise, results stay unchanged.