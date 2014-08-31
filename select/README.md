# Select (:sel)

> System tool to specify the selected item in the current results.

## Usage

After you selected a recipe, and got results from it, at the end of the query add a space, **:sel**, space and write the index of the item to select. The query changes automatically when you select the item from the UI of Pagehop. By default the first item (index 0) is selected, and there is no need to specify :sel 0 at the end of the query.

```
(recipeId string) [recipe options] [other tools] :sel [index]
```


## Examples

Example with Google search and the selection of the 13th element in the results.

```
g search :sel 12
```

## Results

The results scroll to the selected and its visually highlighted to indicate the selection.