describe('Products Displayed Fethcing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    cy.intercept("GET", "**/product/displayed/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Product fetched successfully",
        products: [
          {
            id: "product1",
            name: "Product 1",
            slug: "product-1",
            price: 11000,
            description: "Product 1 description",
            productImage: [{ imageUrl: "image1.jpg", isMainImage: true }],
            productStock: [{ stock: 101 }],
            productDiscountHistories: [{ discountValue: 1100, discount: { discountType: "FIXED_AMOUNT" } }],
            productCategory: { name: "Category 1", slug: "category-1" },
            productSubCategory: { name: "Subcategory 1", slug: "subcategory-1" }
          },
          {
            id: "product2",
            name: "Product 2",
            slug: "product-2",
            price: 12000,
            description: "Product 2 description",
            productImage: [{ imageUrl: "image2.jpg", isMainImage: true }],
            productStock: [{ stock: 102 }],
            productDiscountHistories: [{ discountValue: 10, discount: { discountType: "PERCENTAGE" } }],
            productCategory: { name: "Category 2", slug: "category-2" },
            productSubCategory: { name: "Subcategory 2", slug: "subcategory-2" }
          }
        ]
      }
    }).as("getDisplayedProducts");
  })
  
  it('should fetch displayed products after API call', () => {
    cy.wait('@getDisplayedProducts', { timeout: 10000 });

    // Assert the parent list exists
    cy.get('.product-list').should('exist');

    // Find all product elements and assert length
    cy.get('.product-list')
      .first()
      .find('.product-item')
      .should('have.length', 2);

    // Assert individual products
    cy.get('.product-item')
      .eq(0)
      .should('contain.text', 'Product 1')
      .and('contain.text', 'Category 1')
      .and('contain.text', 'Subcategory 1')
      .and('contain.text', 'Rp 11.000');
    cy.get('.product-item')
      .eq(1)
      .should('contain.text', 'Product 2')
      .and('contain.text', 'Category 2')
      .and('contain.text', 'Subcategory 2')
      .and('contain.text', 'Rp 12.000');
  })
  
})