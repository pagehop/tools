# Regex (:r)

> Tool for a regex matching on the current results.

## Usage

After you selected a recipe, and got results from it, at the end of the query add a space, **:r**, space and write your regular expression.

```
(recipeId string) [recipe options] [other tools] :r [regex]
```

As you have probably already guessed, Regex makes an offline regex matching on what's already found by a recipe (and other tools).


## Examples

Example with Google search followed by a regex matching on the urls (:a - addresses) of the results

```
g kendoui demos :a :r demos.teler.*
```

## Results

The title of the results contain bolded portions, to highlight the matches. Otherwise, results stay unchanged.