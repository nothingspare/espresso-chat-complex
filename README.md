espresso-chat-complex
=============
A sample app built with Logic Designer

TODO:
--only delete or lock my own
--likes creates record
--likes sum into parent
--comment counting

tuts: (context{frontend:[angularjs, bootstrap], backend: [logic designer], database:[mysql]})
comment counting
likes (expose only limited column behaviors[likes_count is updatable for any reason, but all other user actions predicate username=@username])
custom auth (set global variables)
up and ready video (it's worth 3 minutes)
validation (instantantous prop; edit to lock/delete)
resource (security:exposing only specific columns; free sql args)


rules
users can't delete topics with chat
users can only chat on open conversations
--update comment count for users/conversations