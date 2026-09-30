// members:
//   member_id(PK), name, email, join_date

// member_cards:                          ← ONE-TO-ONE
//   card_id(PK), member_id(FK, unique), card_number, issued_date
//   (split out because card issuing/replacement is tracked separately
//    from the member's core identity — exactly one card per member)

// authors:
//   author_id(PK), name, birth_year

// books:                                 ← ONE-TO-MANY (authors → books)
//   book_id(PK), author_id(FK), title, isbn, copies_available

// borrowings:                            ← MANY-TO-MANY (members ↔ books)
//   borrowing_id(PK), member_id(FK), book_id(FK),
//   borrowed_date, due_date, returned_date, late_fee
