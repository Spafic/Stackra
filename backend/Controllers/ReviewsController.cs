using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewRepository _repository;

    public ReviewsController(ReviewRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var entity = _repository.GetById(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Review entity)
    {
        _repository.Insert(entity);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Review entity)
    {
        entity.ReviewId = id;
        _repository.Update(entity);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _repository.Delete(id);
        return NoContent();
    }
}
