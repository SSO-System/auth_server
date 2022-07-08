export async function renderError(ctx, out, error) {
    return ctx.render('renderError', {
        title: "Oops! Something wents wrong!",
        out: out
    })
  }