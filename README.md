# Output

Published Website is accessible at this address : https://laefy.github.io/CPP_Learning/.

# Usage

## Tools

This site is built with [Hugo](https://gohugo.io/documentation/).  
You need to install the tool in order to rebuild the site locally.

## Sources

To obtain the sources:
```b
git clone https://github.com/Laefy/CPP_Learning.git  
git submodule update --init --recursive
```

## Testing

Once you have made some changes to the sources, you can test your modifications locally by running:  
```b
hugo server
```

The website will be accessible on http://localhost:1313/CPP_Learning/.

## Publishing

If you want to publish your website on GitHub (after forking), you need to put the generated files inside the gh-pages branch.  
In order to do that, you may create a worktree in the public/ folder targeting the gh-pages branch:
```b
git worktree add -b gh-pages public origin/gh-pages
```

Then, you generate the site by running:
```b
rm -rf public/*
hugo
```

You can then commit the new version and push it to GitHub:
```b
hash="$(git rev-parse --short HEAD)"
branch="$(git rev-parse --abbrev-ref HEAD)"
desc="$(git show --pretty="format:%s" | head -n 1)"

cd public
git add .
git commit -m "Generated site from ${hash} (${branch}) | ${desc}"
```


